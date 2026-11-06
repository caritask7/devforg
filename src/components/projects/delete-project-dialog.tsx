"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteProjectAction } from "@/lib/actions/projects";

interface DeleteProjectDialogProps {
  projectId: string;
  projectTitle: string;
}

export function DeleteProjectDialog({
  projectId,
  projectTitle,
}: DeleteProjectDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 aria-hidden="true" />
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer ce projet ?</DialogTitle>
          <DialogDescription>
            « {projectTitle} » et ses jalons seront définitivement supprimés. Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>
        <form action={deleteProjectAction} onSubmit={() => setOpen(false)}>
          <input type="hidden" name="projectId" value={projectId} />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="destructive">
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
