import { Loader } from "@/components/ui/preloader";

const Loading = () => {
  return (
    <div className="z-[100] h-screen w-full bg-white">
      <Loader className="absolute left-1/2 top-1/2 size-10" />
    </div>
  );
};

export default Loading;
