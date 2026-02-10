import { motion } from 'motion/react';

function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex items-center px-6 py-4 bg-[#0a1128] shadow-md"
    >
      <div className="flex items-center space-x-4">
        <motion.img
          src="/images/KubeDiagrams.png"
          alt="KubeDiagrams Logo"
          className="h-25 w-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ duration: 0.4 }}
        />
        <a
          href="https://github.com/philippemerle/KubeDiagrams"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub KubeDiagrams repo"
          className="group inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          title="Github repo"
        >
          <motion.img
            src="/images/OctocatGitHub.svg"
            alt="GitHub"
            className="w-6 h-6 opacity-80 group-hover:opacity-100"
            style={{ filter: 'invert(1) brightness(1.8) contrast(0.9)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </motion.header>
  );
}

export default Header;
