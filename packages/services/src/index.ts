// Export service classes
export { BillingService } from './billing-service'
export { DivisionService } from './division-service'
export { GameService, gameService } from './game-service'
export { league } from './league'
export { PaymentService } from './payment-service'
export { PlayerService } from './player-service'
export { RegistrationService } from './registration-service'
export { SeasonService, seasonService } from './season-service'
export { SessionEnrollmentService, sessionEnrollmentService } from './session-enrollment-service'
export { SessionService, sessionService } from './session-service'
export { StripeService } from './stripe-service'
export { TeamLogoService } from './team-logo-service'

// Export Supabase-specific services (these have different names)
export { SupabaseTeamService, SupabaseSeasonService, SupabaseGameService } from './supabase-services'

// Export service instances
import { RegistrationService } from './registration-service'
import { registrationRepository } from '@simpleteams/database'
export const registrationService = new RegistrationService(registrationRepository)

import { DivisionService } from './division-service'
export const divisionService = new DivisionService()
