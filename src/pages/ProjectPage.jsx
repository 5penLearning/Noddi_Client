import MyTeamCard from '../components/common/MyTeamCard';
import ProjectTeamCard from '../components/common/ProjectTeamCard';

import { myTeamMockData } from '../mocks/myTeamData';
import { projectTeamMockData } from '../mocks/myTeamData';

function ProjectPage() {
  return (
    <div className='flex gap-3'>
      <MyTeamCard team={myTeamMockData} />
      <ProjectTeamCard team={projectTeamMockData} />
    </div>
  );
}

export default ProjectPage;
