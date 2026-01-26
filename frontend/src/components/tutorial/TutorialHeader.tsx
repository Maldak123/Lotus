import Logo from "../logo/Logo";

const TutorialHeader = () => {
  return (
    <div className="flex justify-self-center items-center gap-2 opacity-50">
      <Logo />
      <p className="text-3xl font-light">Lotus</p>
    </div>
  );
};

export default TutorialHeader;
