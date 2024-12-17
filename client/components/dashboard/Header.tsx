interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  return (
    // Use setSidebarOpen in your component
    <button
      onClick={() => setSidebarOpen(true)}
      // ... rest of component
    >
      {/* ... */}
    </button>
  );
} 