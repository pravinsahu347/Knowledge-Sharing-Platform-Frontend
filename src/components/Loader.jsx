const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-pulse text-slate">
        {text}
      </div>
    </div>
  );
};

export default Loader;