import { Link } from "wouter";
import { Facebook, Twitter, Github } from "lucide-react";

interface FooterProps {
  isAdminView: boolean;
}

export function Footer({ isAdminView }: FooterProps) {
  return (
    <footer className={`border-t ${isAdminView ? 'bg-[#1E293B] text-white border-[#334155]' : 'bg-white text-[#212121] border-gray-200'}`}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className={`${isAdminView ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-500'}`}>
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>

            <a href="#" className={`${isAdminView ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-500'}`}>
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>

            <a href="#" className={`${isAdminView ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-500'}`}>
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 md:mt-0">
            <p className={`text-center text-sm ${isAdminView ? 'text-gray-400' : 'text-gray-500'}`}>
              © {new Date().getFullYear()} AppName. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
