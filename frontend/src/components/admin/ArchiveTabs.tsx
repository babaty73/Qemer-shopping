import { cn } from "@/lib/utils";

interface ArchiveTabsProps {
  showArchived: boolean;
  onChange: (archived: boolean) => void;
  archivedLabel?: string;
}

/** Active/Archived segmented control — shared by the Orders and Custom Requests lists. */
export function ArchiveTabs({ showArchived, onChange, archivedLabel = "Archived" }: ArchiveTabsProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-surface p-1">
      <TabButton active={!showArchived} onClick={() => onChange(false)}>
        Active
      </TabButton>
      <TabButton active={showArchived} onClick={() => onChange(true)}>
        {archivedLabel}
      </TabButton>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-primary text-white shadow-soft" : "text-neutral-500 hover:text-neutral-900"
      )}
    >
      {children}
    </button>
  );
}
