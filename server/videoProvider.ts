// server/videoProvider.ts
// Provider seam for real video generation. Provider API keys stay server-side.
// Until a provider is registered and configured, generation reports
// "provider not configured" — the app never fakes a video.
export interface VideoGenerationRequest {
  question: string
  topic: string
  difficulty: string
  minutes: number
  /** Step-by-step text solution produced by the AI tutor — used as the video script. */
  script: string
}

export interface GeneratedVideo {
  videoUrl: string
  provider: string
  durationSeconds?: number
}

export interface VideoProvider {
  readonly name: string
  generate(request: VideoGenerationRequest): Promise<GeneratedVideo>
}

export class ProviderNotConfiguredError extends Error {
  constructor(message = 'No video generation provider is configured. Set VIDEO_PROVIDER and VIDEO_PROVIDER_API_KEY in .env to enable real video output.') {
    super(message)
    this.name = 'ProviderNotConfiguredError'
  }
}

// Register future providers here, e.g.:
//   providers.set('acme-video', (apiKey) => new AcmeVideoProvider(apiKey))
const providers = new Map<string, (apiKey: string) => VideoProvider>()

export function registerVideoProvider(name: string, factory: (apiKey: string) => VideoProvider): void {
  providers.set(name, factory)
}

export function getVideoProvider(): VideoProvider {
  const providerName = process.env.VIDEO_PROVIDER
  const apiKey = process.env.VIDEO_PROVIDER_API_KEY
  if (!providerName || !apiKey) throw new ProviderNotConfiguredError()
  const factory = providers.get(providerName)
  if (!factory) {
    throw new ProviderNotConfiguredError(
      `Unknown VIDEO_PROVIDER "${providerName}". Registered providers: ${[...providers.keys()].join(', ') || 'none yet'}.`,
    )
  }
  return factory(apiKey)
}
