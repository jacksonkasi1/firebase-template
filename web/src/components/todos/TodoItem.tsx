// TodoItem — IBM Carbon tile style on shadcn/ui
// ───────────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState } from "react"

// ─── shadcn/ui ───────────────────────────────
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// ─── Internal ────────────────────────────────
import type { Todo } from "@/types"

// ─────────────────────────────────────────────
interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => Promise<void>
  onEdit: (id: string, title: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!editTitle.trim() || editTitle === todo.title) {
      setEditing(false)
      setEditTitle(todo.title)
      return
    }
    setSaving(true)
    await onEdit(todo.id, editTitle.trim())
    setSaving(false)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave()
    if (e.key === "Escape") {
      setEditing(false)
      setEditTitle(todo.title)
    }
  }

  return (
    <div
      className={`group ibm-transition flex items-center gap-4 border-b border-border px-4 py-3 hover:bg-muted/40 ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      {/* Checkbox */}
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id, todo.completed)}
        className="rounded-none border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
      />

      {/* Title / Edit input */}
      {editing ? (
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="h-8 flex-1 rounded-none border-0 border-b border-primary bg-transparent px-0 text-sm tracking-[0.16px] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      ) : (
        <label
          htmlFor={`todo-${todo.id}`}
          className={`flex-1 cursor-pointer text-sm tracking-[0.16px] ${
            todo.completed
              ? "text-muted-foreground line-through"
              : "text-foreground"
          }`}
        >
          {todo.title}
        </label>
      )}

      {/* Status badge */}
      {todo.completed && !editing && (
        <Badge
          variant="secondary"
          className="rounded-none border-border text-xs tracking-[0.16px]"
        >
          Done
        </Badge>
      )}

      {/* Actions */}
      <div className="ibm-transition flex items-center gap-1 opacity-0 group-hover:opacity-100">
        {editing ? (
          <>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-7 rounded-none bg-primary px-3 text-xs text-primary-foreground hover:bg-[#0050e6]"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditing(false)
                setEditTitle(todo.title)
              }}
              className="h-7 rounded-none px-3 text-xs"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(true)}
              className="h-7 rounded-none px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
              className="h-7 rounded-none px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
