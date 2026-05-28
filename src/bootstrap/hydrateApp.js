import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"
import { useCourseProgressStore } from "../stores/courseProgress"

export async function hydrateApp() {

    const auth = useAuthStore()

    const entitlements =
        useEntitlementStore()

    const courseProgress =
        useCourseProgressStore()

    await auth.fetchUser()

    if (auth.user?.id) {

        await Promise.all([

            entitlements.fetchEntitlements(
                auth.user.id
            ),

            courseProgress.fetchProgress(
                auth.user.id
            )

        ])

    }

}