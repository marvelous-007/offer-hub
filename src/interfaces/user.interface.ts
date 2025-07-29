export interface User {
    id: number,
    name: string,
    email: string,
    emailValidated: boolean,
    identityCard: string,
    status: string,
    submissionDate: string,
    location: string,
    role: string,
    analytics: {
        totalClients: number
        clientsChange: number
        completedJobs: number
        jobsChange: number
        totalPayments: number
        paymentsChange: number
        profileViews: number
        viewsChange: number
      }
}

// export interface AnalyticsUser {
//     id: number
//     name: string
//     email: string
//     location: string
//     userId: string
//     role: string
//     status: string
//     dateJoined: string
//     analytics: {
//       totalClients: number
//       clientsChange: number
//       completedJobs: number
//       jobsChange: number
//       totalPayments: number
//       paymentsChange: number
//       profileViews: number
//       viewsChange: number
//     }
//   }