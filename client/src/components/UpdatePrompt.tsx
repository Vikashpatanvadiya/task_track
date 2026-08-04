import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { setUpdateListener } from "@/lib/pwa";

/**
 * Surfaces a "new version available" toast when the service worker has a
 * newer build waiting. Applying it activates the new worker, which triggers
 * a reload via the controllerchange handler in lib/pwa.
 */
export function UpdatePrompt() {
  const { toast } = useToast();

  useEffect(() => {
    setUpdateListener((applyUpdate) => {
      toast({
        title: "Update available",
        description: "A new version of Bansi.R is ready.",
        action: (
          <ToastAction altText="Reload to update" onClick={applyUpdate}>
            Reload
          </ToastAction>
        ),
      });
    });
  }, [toast]);

  return null;
}
