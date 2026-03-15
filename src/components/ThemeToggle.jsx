import { useTheme } from "@/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import '@/css/ThemeToggle.css';

const ThemeToggle = ({className}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className={`theme-btn m-0 p-0 ` + className}
      title={theme === "light" ? "flashbang!" : "go to sleep"}
    >
      <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
    </button>
  );
};

export {ThemeToggle};