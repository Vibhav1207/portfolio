import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  src: string;
  title: string;
  description: string;
  githubLink: string; 
  liveDemoLink: string;
};

export const ProjectCard = ({
  src,
  title,
  description,
  githubLink,
  liveDemoLink,
}: ProjectCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg border border-[#2A0E61]">
      <div className="absolute inset-0 border-4 border-transparent rounded-lg neon-border"></div>
      <Link
        href={liveDemoLink}
        target="_blank"
        rel="noreferrer noopener"
        className="relative z-10"
      >
        <Image
          src={src}
          alt={title}
          width={1000}
          height={1000}
          className="w-full object-contain"
        />
      </Link>

      <div className="relative p-4 z-10">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-gray-300">{description}</p>
        <div className="flex justify-between mt-4">
          <Link
            href={githubLink}
            target="_blank"
            rel="noreferrer noopener"
            className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            GitHub
          </Link>
          <Link
            href={liveDemoLink}
            target="_blank"
            rel="noreferrer noopener"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
          >
            Live Demo
          </Link>
        </div>
      </div>
    </div>
  );
};