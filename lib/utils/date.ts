export function formatGameDate(date: string | null | undefined) {
  if (!date) return "TBD"
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatGameTime(time: string | null | undefined) {
  if (!time) return "TBD"
  const match = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return time

  const [_, hours, minutes] = match
  const date = new Date()
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10))
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatFullGameDate(date: string | null | undefined) {
  if (!date) return "TBD"
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function isGameInProgress(game: { gameDate: string; status: string }) {
  return (
    game.status === "in-progress" &&
    new Date(game.gameDate).toDateString() === new Date().toDateString()
  )
}

export function isGameUpcoming(game: { gameDate: string; status: string }) {
  return (
    game.status === "scheduled" && new Date(game.gameDate) > new Date()
  )
}
