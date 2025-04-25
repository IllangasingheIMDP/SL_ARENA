const roleRequests = [
    {
        request_id: 7,
        user_id: 14,
        requested_role: "organisation",
        
        requested_at: "2025-04-25T12:00:37.000Z",
        reviewed_at: null,
        name: "Lishani",
        email: "lishani@gmail.com",
        // Organisation specific details
        organizationName: "Cricket Academy",
        organizationType: "Cricket Training Center",
        establishmentYear: "2020",
        website: "www.cricketacademy.com",
        socialMediaHandles: "@cricketacademy",
        primaryContactName: "Lishani Perera",
        primaryContactPosition: "Director",
        primaryContactEmail: "lishani@gmail.com",
        primaryContactNumber: "+94771234567",
        typesOfTournaments: "School, Club, District",
        ageGroups: "U13, U15, U19",
        formats: "T20, ODI",
        scale: "District",
        previousTournaments: "School Cricket Championship 2023",
        venueDetails: "Main Ground, Indoor Nets, Gym",
        venueFacilities: "Changing Rooms, Cafeteria, Parking",
        scoringSystems: "CricClubs",
        matchOfficialsNetwork: "Local Umpires Association",
        liveStreamingCapabilities: "Basic",
        sponsorshipHistory: "Local Businesses",
        bankName: "Commercial Bank",
        accountNumber: "1234567890",
        accountType: "Business",
        tournamentBudgetRange: "LKR 500,000 - 1,000,000",
        sponsorshipTiers: "Gold, Silver, Bronze",
        prizeMoneyStructure: "Winner: 100,000, Runner-up: 50,000",
        // Documents
        documents: {
            businessRegistration: "/images/documents/business_reg_7.pdf",
            taxId: "/images/documents/tax_id_7.pdf",
            organizationCharter: "/images/documents/charter_7.pdf",
            authorityLetter: "/images/documents/authority_7.pdf",
            identityProof: "/images/documents/id_7.pdf",
            boardResolution: "/images/documents/board_res_7.pdf",
            tournamentBrochures: "/images/documents/brochures_7.pdf",
            pastEventsPhotos: "/images/documents/events_7.pdf",
            mediaCoverage: "/images/documents/media_7.pdf",
            testimonials: "/images/documents/testimonials_7.pdf",
            awards: "/images/documents/awards_7.pdf",
            venueOwnership: "/images/documents/venue_7.pdf",
            venuePermission: "/images/documents/permission_7.pdf",
            safetyCertificates: "/images/documents/safety_7.pdf",
            insuranceCoverage: "/images/documents/insurance_7.pdf",
            bankStatement: "/images/documents/bank_7.pdf",
            financialStatement: "/images/documents/financial_7.pdf",
            sponsorshipAgreements: "/images/documents/sponsorship_7.pdf",
            prizeMoneyProof: "/images/documents/prize_7.pdf"
        }
    },
    {
        request_id: 6,
        user_id: 11,
        requested_role: "player",
        
        requested_at: "2025-04-25T11:44:51.000Z",
        reviewed_at: null,
        name: "Kusal Mendis",
        email: "kusal@gmail.com",
        // Player specific details
        playerRole: "Batsman",
        battingStyle: "Right-handed",
        bowlingStyle: "Right-arm off break",
        playingExperience: "8 years",
        highestLevelPlayed: "National",
        preferredFormat: "All formats",
        previousTeams: "Colombo Cricket Club, Sri Lanka U19",
        notableAchievements: "Century in U19 World Cup",
        jerseyNumber: "7",
        // Documents
        documents: {
            nationalId: "/images/documents/national_id_6.pdf",
            ageProof: "/images/documents/age_proof_6.pdf",
            passportPhoto: "/images/documents/passport_6.jpg",
            addressProof: "/images/documents/address_6.pdf",
            playingCertificates: "/images/documents/certificates_6.pdf",
            previousScorecards: "/images/documents/scorecards_6.pdf"
        }
    },
    {
        request_id: 1,
        user_id: 2,
        requested_role: "trainer",
        
        requested_at: "2025-04-25T10:19:03.000Z",
        reviewed_at: "2025-04-25T11:39:43.000Z",
        name: "Hiruna Nimesh",
        email: "nimeshhiruna@gmail.com",
        // Trainer specific details
        specializationAreas: ["Batting", "Fielding", "Fitness"],
        coachingExperience: "5 years",
        highestLevelCoached: "National",
        coachingQualifications: "Level 2 Cricket Coach",
        playerExperience: "10 years",
        notableStudents: "National U19 players",
        coachingMethodology: "Technical and Mental Training",
        ageGroupsSpecialized: "U13 to Senior",
        hourlyRates: "LKR 2000",
        availability: "Weekdays: 4pm-8pm, Weekends: 9am-5pm",
        // Documents
        documents: {
            coachingCertificates: "/images/documents/coaching_cert_1.pdf",
            educationQualifications: "/images/documents/education_1.pdf",
            professionalReferences: "/images/documents/references_1.pdf",
            policeClearance: "/images/documents/police_1.pdf",
            employmentProof: "/images/documents/employment_1.pdf",
            professionalInsurance: "/images/documents/insurance_1.pdf"
        }
    }
];

export default roleRequests;
