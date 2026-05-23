export const useCoursePurchases = () => {

    const purchaseFullProgramme = () => {
        console.log("Full programme checkout will go here")
    }

    const purchaseWeek = (weekNumber) => {
        console.log(`Week ${weekNumber} checkout will go here`)
    }

    return {
        purchaseFullProgramme,
        purchaseWeek
    }

}