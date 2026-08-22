import { Component } from "react";

/**
 * Catches dynamic-import failures caused by a stale browser cache
 * (e.g. after a new deploy renames hashed chunks). Offers a reload,
 * which fetches the fresh bundle.
 */
class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Vite/webpack chunk load failures
    if (
      error?.name === "ChunkLoadError" ||
      /Loading chunk|dynamically imported module|Failed to fetch/i.test(
        error?.message || ""
      )
    ) {
      console.warn("Stale chunk detected — reloading app...");
      window.location.reload();
    }
  }

  handleReload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Something went wrong
          </h1>
          <p className="max-w-sm text-gray-500">
            The page failed to load. This usually happens after an app update —
            a quick refresh fixes it.
          </p>
          <button
            onClick={this.handleReload}
            className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
