import { FaYoutube, FaFacebook } from "react-icons/fa";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";

export const SKILL_DATA = [
  {
    skill_name: "",
    image: "",
    width: 0,
    height: 0,
  },
  {
    skill_name: "",
    image: "",
    width: 0,
    height: 0,
  },
  {
    skill_name: "",
    image: "",
    width: 0,
    height: 0,
  },
  {
    skill_name: "",
    image: "",
    width: 0,
    height: 0,
  },
  {
    skill_name: "",
    image: "",
    width: 0,
    height: 0,
  },

  {
    skill_name: "",
    image: "",
    width: 0,
    height: 0,
  },
  {
    skill_name: "",
    image: "",
    width: 0,
    height: 0,
  },

  {
    skill_name: "",
    image: "",
    width: 0,
    height: 0,
  },
  {
    skill_name: "",
    image: "",
    width: 0,
    height: 0,
  },
] as const; 

export const SOCIALS = [
  {
    name: "Instagram",
    icon: RxInstagramLogo,
    link: "https://instagram.com",
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    link: "https://facebook.com",
  },
  {
    name: "Twitter",
    icon: RxTwitterLogo,
    link: "https://twitter.com",
  },
] as const;

export const FRONTEND_SKILL = [
  {
    skill_name: "HTML",
    image: "html.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "CSS",
    image: "css.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "JavaScript",
    image: "js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "Tailwind CSS",
    image: "tailwind.png",
    width: 80,
    height: 80,
  },

  {
    skill_name: "React",
    image: "react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "TypeScript",
    image: "ts.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Next.js 14",
    image: "next.png",
    width: 80,
    height: 80,
  },
] as const;

export const BACKEND_SKILL = [
  {
    skill_name: "Node.js",
    image: "node.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Express.js",
    image: "express.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "MongoDB",
    image: "mongodb.png",
    width: 40,
    height: 40,
  },
] as const;

export const FULLSTACK_SKILL = [
  {
    skill_name: "React Native",
    image: "reactnative.png",
    width: 70,
    height: 70,
  },

  {
    skill_name: "Figma",
    image: "figma.png",
    width: 50,
    height: 50,
  },
] as const;

export const OTHER_SKILL = [
  {
    skill_name: "Go",
    image: "go.png",
    width: 60,
    height: 60,
  },
] as const;

export const PROJECTS = [
  {
    title: "ZOROVERSE",
    description:
      'An immersive anime streaming platform with a sleek design, seamless navigation, and personalized watchlists for every anime fan.',
    image: "data:image/jpeg;base64,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",
    link: "https://zoroverse.xyz",
  },
  {
    title: "FroDy Customs",
    description:
      'An e-commerce store specializing in custom GTA RP cars, offering unique designs tailored for roleplay enthusiasts..',
    image: "https://imgur.com/TIP5JVf",
    link: "https://frodycustoms.shop",
  },
  {
    title: "3",
    description:
      'An e-commerce store specializing in custom GTA RP cars, offering unique designs tailored for roleplay enthusiasts..',
    image: "3",
    link: "https://example.com",
  },
] as const;

export const FOOTER_DATA = [
  {
    title: "Community",
    data: [
      {
        name: "YouTube",
        icon: FaYoutube,
        link: "https://youtube.com",
      },
      {
        name: "GitHub",
        icon: RxGithubLogo,
        link: "https://github.com/Vibhav1207",
      },
      {
        name: "Discord",
        icon: RxDiscordLogo,
        link: "https://discord.gg/reefbot",
      },
    ],
  },
  {
    title: "Social Media",
    data: [
      {
        name: "Instagram",
        icon: RxInstagramLogo,
        link: "https://instagram.com",
      },
      {
        name: "Github",
        icon: RxGithubLogo,
        link: "https://github.com/Vibhav1207",
      },
      {
        name: "Linkedin",
        icon: RxLinkedinLogo,
        link: "https://www.linkedin.com/in/vibhavpatel/",
      },
    ],
  },
  {
    title: "About",
    data: [
      {
        name: "Become Sponsor",
        icon: null,
        link: "https://youtube.com",
      },
      {
        name: "Learning about me",
        icon: null,
        link: "https://example.com",
      },
      {
        name: "Contact Me",
        icon: null,
        link: "mailto:vibhav07patel@gmail.com",
      },
    ],
  },
] as const;

export const NAV_LINKS = [
  {
    title: "About me",
    link: "#about-me",
  },
  {
    title: "Skills",
    link: "#skills",
  },
  {
    title: "Projects",
    link: "#projects",
  },
] as const;

export const LINKS = {
  sourceCode: "https://github.com/Vibhav1207",
};
