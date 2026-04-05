export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  challenges: string;
  tags: string[];
  link: string;
  image: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
}

export interface PersonalInfo {
  name: string;
  location: string;
  status: string;
  bio: string;
  interests: string[];
}
