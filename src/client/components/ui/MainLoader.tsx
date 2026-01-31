import Loader from "./Loader";

const MainLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      <Loader size="lg" />
    </div>
  );
};

export default MainLoader;
