import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ApplicationCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/user/job-listing');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigate]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold text-green-600">❌ Application Cancelled!</h1>
      <p className="mt-2">Your have Cancelled application for job.</p>
      <p className="mt-2 text-gray-700 font-medium">
        Navigating back to dashboard
      </p>
      <p className="mt-1 text-sm text-gray-500">Redirecting in 3 seconds...</p>
    </div>
  );
}
