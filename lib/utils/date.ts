export function formatGameDate(date: string | null | undefined) {
  if (!date) return "TBD"
  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date format received: ${date}`)
      return "TBD"
    }
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(parsedDate)
  } catch (error) {
    console.warn(`Error formatting date: ${date}`, error)
    return "TBD"
  }
}

export function formatGameTime(time: string | null | undefined) {
  if (!time) return "TBD"
  try {
    const match = time.match(/^(\d{1,2}):(\d{2})$/)
    if (!match) {
      console.warn(`Invalid time format received: ${time}`)
      return time // Return as-is if format doesn't match
    }

    const [_, hours, minutes] = match
    const date = new Date()
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10))

    if (isNaN(date.getTime())) {
      console.warn(`Invalid time values: ${hours}:${minutes}`)
      return time
    }

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  } catch (error) {
    console.warn(`Error formatting time: ${time}`, error)
    return time
  }
}

export function formatFullGameDate(date: string | null | undefined) {
  if (!date) return "TBD"
  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date format received in formatFullGameDate: ${date}`)
      return "TBD"
    }
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate)
  } catch (error) {
    console.warn(`Error formatting full date: ${date}`, error)
    return "TBD"
  }
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
