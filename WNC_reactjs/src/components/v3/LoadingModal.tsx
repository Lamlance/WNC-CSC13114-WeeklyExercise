import { useAppSelector } from "../../hooks/Redux/ReduxHook";

function LoadingCircle({ msg }: { msg?: string }) {
  return (
    <div className=" flex flex-col w-full h-full place-content-center items-center">
      <svg
        className=" animate-spin text-white flex-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className=" text-center font-semibold text-2xl">
        {msg ? msg : "Loading"}
      </p>
    </div>
  );
}

export default function LoadingModal() {
  const loading = useAppSelector((state) => state.loading);

  return (
    <>
      {!loading ? null : (
        <div className=" absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center bg-black bg-opacity-10 z-10 backdrop-blur-sm">
          <div>
            <LoadingCircle msg={loading} />
          </div>
        </div>
      )}
    </>
  );
}
