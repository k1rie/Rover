import Hero from "@/sections/Hero/Hero";
import Introduction from "@/sections/Introduction/Introduction";
import MarsExplorer from "@/sections/MarsExplorer/MarsExplorer";
import HowItWorks from "@/sections/HowItWorks/HowItWorks";
import AssemblyShowcase from "@/sections/AssemblyShowcase/AssemblyShowcase";
import Components from "@/sections/Components/Components";
import Electronics from "@/sections/Electronics/Electronics";
import Code from "@/sections/Code/Code";
import Interactive from "@/sections/Interactive/Interactive";
import Flow from "@/sections/Flow/Flow";
import BuildSteps from "@/sections/BuildSteps/BuildSteps";
import Team from "@/sections/Team/Team";
import Resources from "@/sections/Resources/Resources";

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <MarsExplorer />
      <HowItWorks />
      <AssemblyShowcase />
      <Components />
      <Electronics />
      <Code />
      <Interactive />
      <Flow />
      <BuildSteps />
      <Team />
      <Resources />
    </>
  );
}
