import { BlogPost, Project, Education, PersonalInfo } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Design',
    date: 'March 20, 2024',
    excerpt: 'Exploring how 3D elements and immersive scrolling are changing user experiences.',
    image: 'https://picsum.photos/seed/design/800/600'
  },
  {
    id: '2',
    title: 'A Day in the Life of a Developer',
    date: 'February 15, 2024',
    excerpt: 'Coffee, code, and constant learning. My daily routine and productivity tips.',
    image: 'https://picsum.photos/seed/dev/800/600'
  },
  {
    id: '3',
    title: 'Traveling the World Solo',
    date: 'January 10, 2024',
    excerpt: 'Lessons learned from backpacking across Southeast Asia with just a laptop.',
    image: 'https://picsum.photos/seed/travel/800/600'
  },
  {
    id: '4',
    title: 'The Art of Minimalist UI',
    date: 'December 05, 2023',
    excerpt: 'How stripping away the non-essential can lead to more powerful user interfaces.',
    image: 'https://picsum.photos/seed/minimal/800/600'
  }
];

export const PERSONAL_INFO: PersonalInfo = {
  name: 'HARSHIT CHAUHAN',
  location: 'Mumbai, Maharashtra, India',
  status: 'Open for high-impact collaborations',
  bio: 'I am a creative developer and designer obsessed with the intersection of aesthetics and code. My journey started in traditional design, but I quickly realized that the web is the ultimate canvas for interactive storytelling. I travel the world, drawing inspiration from different cultures and landscapes to fuel my digital creations.',
  interests: ['Generative Art', '3D Web', 'Minimalism', 'Solo Travel', 'Coffee Culture']
};

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Cyber-Grid Dashboard',
    description: 'A real-time analytics dashboard with a futuristic aesthetic, designed for high-density data monitoring.',
    technologies: 'Built with React for the UI, D3.js for complex data visualizations, and Tailwind CSS for the brutalist-tech styling. State management is handled via Zustand for performance.',
    challenges: 'The primary challenge was rendering thousands of data points in real-time without dropping frames. I optimized this by using canvas rendering for the main data grid and implementing a custom virtualization layer.',
    tags: ['React', 'D3.js', 'Tailwind'],
    link: '#',
    image: 'https://picsum.photos/seed/grid/800/600'
  },
  {
    id: '2',
    title: 'Neural Network Visualizer',
    description: 'An interactive 3D visualization tool for deep learning models, allowing users to inspect layers and weights.',
    technologies: 'Developed using TypeScript and Three.js for 3D rendering. The mathematical computations for layer activations are performed using custom GLSL shaders for GPU acceleration.',
    challenges: 'Visualizing dense connections between layers created significant visual noise. I solved this by implementing an edge-bundling algorithm and dynamic opacity based on weight magnitude.',
    tags: ['TypeScript', 'Three.js', 'GLSL'],
    link: '#',
    image: 'https://picsum.photos/seed/neural/800/600'
  },
  {
    id: '3',
    title: 'Quantum Chat App',
    description: 'A secure, end-to-end encrypted messaging platform featuring a unique, immersive user interface.',
    technologies: 'Utilizes WebSockets for real-time communication and the Web Crypto API for client-side encryption. The UI is built with React and Framer Motion for complex animations.',
    challenges: 'Ensuring consistent message ordering across distributed clients while maintaining strict encryption was difficult. I implemented a vector clock system to manage causality without a central authority.',
    tags: ['WebSockets', 'Crypto', 'React'],
    link: '#',
    image: 'https://picsum.photos/seed/chat/800/600'
  }
];

export const EDUCATION: Education[] = [
  {
    id: '1',
    institution: 'NMIMS,MPSTME',
    degree: 'Diploma In C.E',
    period: '2024 - 2028',
    description: 'Concepts, fundamentals, and practical skills developed through coursework and academic projects.'
  },
  {
    id: '2',
    institution: 'Don Bosco High School',
    degree: 'HSC',
    period: '2016 - 2024',
    description: 'Core concepts and fundamentals learned through academic coursework in computer engineering..'
  }
];
