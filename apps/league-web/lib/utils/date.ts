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
    let timeStr: string

    // Check if it's a full timestamp - extract just the time portion
    if (time.includes('T')) {
      // Extract time portion after 'T' (e.g., "2025-06-06T19:15:00+00" -> "19:15")
      const timePart = time.split('T')[1]
      timeStr = timePart.substring(0, 5) // Get first 5 chars (HH:MM)
    } else if (time.includes(' ')) {
      // Handle space-separated format (e.g., "2025-06-06 19:15:00+00" -> "19:15")
      const parts = time.split(' ')
      if (parts.length >= 2) {
        timeStr = parts[1].substring(0, 5) // Get first 5 chars (HH:MM)
      } else {
        timeStr = time
      }
    } else {
      // It's already a time string like "19:15"
      timeStr = time
    }

    // Parse and format the time string
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/)
    if (!match) {
      console.warn(`Invalid time format: ${timeStr} (from: ${time})`)
      return time
    }

    const [_, hours, minutes] = match
    const hour24 = parseInt(hours, 10)
    const min = parseInt(minutes, 10)

    if (hour24 < 0 || hour24 > 23 || min < 0 || min > 59) {
      console.warn(`Invalid time values: ${hours}:${minutes}`)
      return time
    }

    // Convert 24-hour format to 12-hour format
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
    const ampm = hour24 >= 12 ? 'PM' : 'AM'
    const formattedMinutes = min.toString().padStart(2, '0')

    return `${hour12}:${formattedMinutes} ${ampm}`
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
