const AuthLayout = ({ children }) => {
  return (
    <>
      <div className="flex min-h-[600px] items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      <div className="hidden min-h-[600px] md:block">
        <img
          src="/Rectangle 1.svg"
          alt="Wood and Decor"
          className="h-full w-full object-cover"
        />
      </div>
      </>
  );
};

export default AuthLayout;
