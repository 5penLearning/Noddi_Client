const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  'https://www.noddi-dev.site'
).replace(/\/$/, '');

const ACCESS_TOKEN_KEY = 'noddi_access_token';

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
}

function getAuthorizationHeaders() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

async function readErrorMessage(
  response,
  fallbackMessage,
) {
  try {
    const data = await response.clone().json();

    return (
      data?.message ??
      data?.error?.message ??
      fallbackMessage
    );
  } catch {
    try {
      const text = await response.text();

      return text || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }
}

function normalizeProjects(payload) {
  const result = payload?.result ?? payload;

  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.content)) {
    return result.content;
  }

  if (
    result &&
    typeof result === 'object' &&
    result.projectId
  ) {
    return [result];
  }

  return [];
}

/**
 * GET /api/v1/projects 는 조직 전체 프로젝트를 반환한다.
 *
 * Q&A 화면에서는 내가 실제 접근 가능한 프로젝트만 보여야 하므로
 * 각 프로젝트의 팀 목록 API를 호출해서 접근 가능한 프로젝트만 남긴다.
 *
 * 추후 백엔드에 "내가 참여 중인 프로젝트 목록 API"가 추가되면
 * 이 N+1 필터링은 제거하는 것이 좋다.
 */
export async function getQaProjects() {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...getAuthorizationHeaders(),
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        '프로젝트 목록을 불러오지 못했습니다.',
      ),
    );
  }

  const payload = await response.json();

  const organizationProjects =
    normalizeProjects(payload);

  if (organizationProjects.length === 0) {
    return [];
  }

  const authorizationHeaders =
    getAuthorizationHeaders();

  const checks = await Promise.allSettled(
    organizationProjects.map(
      async (project) => {
        const projectId =
          project?.projectId;

        if (!projectId) {
          throw new Error(
            'projectId가 없는 프로젝트입니다.',
          );
        }

        const teamResponse = await fetch(
          `${API_BASE_URL}/api/v1/projects/${projectId}/teams`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              ...authorizationHeaders,
            },
          },
        );

        if (!teamResponse.ok) {
          throw new Error(
            `프로젝트 접근 권한 확인 실패: ${projectId}`,
          );
        }

        return project;
      },
    ),
  );

  return checks
    .filter(
      (result) =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value);
}

function parseEventData(rawData) {
  if (!rawData) {
    return '';
  }

  try {
    return JSON.parse(rawData);
  } catch {
    return rawData;
  }
}

function parseSseBlock(block) {
  const normalizedBlock =
    block.replace(/\r/g, '');

  const lines =
    normalizedBlock.split('\n');

  let event = 'message';

  const dataLines = [];

  lines.forEach((line) => {
    if (
      !line ||
      line.startsWith(':')
    ) {
      return;
    }

    if (line.startsWith('event:')) {
      event =
        line.slice(6).trim() ||
        'message';

      return;
    }

    if (line.startsWith('data:')) {
      dataLines.push(
        line
          .slice(5)
          .replace(/^ /, ''),
      );
    }
  });

  return {
    event,
    data: parseEventData(
      dataLines.join('\n'),
    ),
  };
}

/**
 * GET /api/v1/qa/questions/{questionId}/answer-stream
 *
 * EventSource는 Authorization 헤더를 넣을 수 없기 때문에
 * fetch + ReadableStream으로 SSE를 읽는다.
 */
export async function subscribeQaAnswerStream(
  questionId,
  {
    signal,
    onEvent,
  } = {},
) {
  if (!questionId) {
    throw new Error(
      'questionId가 필요합니다.',
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/qa/questions/${questionId}/answer-stream`,
    {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache',
        ...getAuthorizationHeaders(),
      },
      cache: 'no-store',
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        'AI 답변 스트림에 연결하지 못했습니다.',
      ),
    );
  }

  if (!response.body) {
    throw new Error(
      'AI 답변 스트림 응답 본문이 없습니다.',
    );
  }

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder('utf-8');

  let buffer = '';

  const emitBlock = (block) => {
    if (!block.trim()) {
      return;
    }

    const {
      event,
      data,
    } = parseSseBlock(block);

    onEvent?.(event, data);
  };

  try {
    while (true) {
      const {
        value,
        done,
      } = await reader.read();

      if (done) {
        buffer += decoder.decode();

        break;
      }

      buffer += decoder.decode(
        value,
        {
          stream: true,
        },
      );

      buffer = buffer.replace(
        /\r\n/g,
        '\n',
      );

      let boundaryIndex =
        buffer.indexOf('\n\n');

      while (
        boundaryIndex !== -1
      ) {
        const block =
          buffer.slice(
            0,
            boundaryIndex,
          );

        buffer = buffer.slice(
          boundaryIndex + 2,
        );

        emitBlock(block);

        boundaryIndex =
          buffer.indexOf('\n\n');
      }
    }

    if (buffer.trim()) {
      emitBlock(buffer);
    }
  } finally {
    reader.releaseLock();
  }
}
