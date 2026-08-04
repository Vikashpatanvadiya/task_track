import { useEffect, useState } from "react";
import { Download, Share, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isIos, isStandalone } from "@/lib/pwa";

/** Chrome/Edge/Samsung fire this; it is not in the DOM lib types. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "bansi.installPromptDismissedAt";
const SNOOZE_MS = 1000 * 60 * 60 * 24 * 14; // two weeks

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISSED_KEY));
    return Boolean(at) && Date.now() - at < SNOOZE_MS;
  } catch {
    return false;
  }
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Already installed, or the user waved it away recently.
    if (isStandalone() || recentlyDismissed()) return;

    const onBeforeInstall = (event: Event) => {
      // Suppress the mini-infobar so we can offer install in our own UI.
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setHidden(false);
    };

    const onInstalled = () => {
      setDeferred(null);
      setHidden(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS Safari has no install event — surface the manual Share > Add flow.
    if (isIos()) {
      setShowIosHelp(true);
      setHidden(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      /* private mode — just hide for this session */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setHidden(true);
  };

  if (hidden || (!deferred && !showIosHelp)) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-none"
      role="dialog"
      aria-label="Install Bansi.R"
    >
      <div className="glass-card pointer-events-auto mx-auto flex max-w-md items-start gap-3 rounded-2xl p-4 shadow-lg">
        <img
          src="/icons/icon-192.png"
          alt=""
          className="h-11 w-11 shrink-0 rounded-xl"
        />

        <div className="min-w-0 flex-1">
          <p className="font-serif text-base font-semibold leading-tight text-foreground">
            Install Bansi.R
          </p>

          {showIosHelp ? (
            <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              Tap
              <Share className="inline h-4 w-4 shrink-0" aria-label="Share" />
              then
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Plus className="inline h-4 w-4 shrink-0" />
                Add to Home Screen
              </span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Add it to your home screen to open it like an app — full screen and
              available offline.
            </p>
          )}

          {!showIosHelp && (
            <Button size="sm" className="mt-3 gap-2" onClick={install}>
              <Download className="h-4 w-4" /> Install
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="-mr-1 -mt-1 h-8 w-8 shrink-0 text-muted-foreground"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
