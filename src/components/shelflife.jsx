import { Navigate } from 'react-router-dom';

function RedirectComponent() {
  
  return <Navigate to="/Home" replace />;
}

export default RedirectComponent;