import MyTeamCard from '../components/common/MyTeamCard';
import { myTeamMockData } from '../mocks/myTeamData';

function ProjectPage() {
  return <MyTeamCard team={myTeamMockData} />;
}

export default ProjectPage;
