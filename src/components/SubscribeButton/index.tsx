import { signIn, useSession } from "next-auth/client"
import { api } from "../../services/api"
import styles from "./styles.module.scss"
interface SubscribeButtonProps {
    productId: string
}

// getServerSideProps (SSR)
// getStaticProps (SSG)
// API routes
export function SubscribeButton({ productId } : SubscribeButtonProps) {
    const [ session ] = useSession()

    async function handleSubcribe(){
        if (!session) {
            signIn('github')
            return            
        }
        try {
            const response = await api.post('/subscribe')
            const { sessionId } = response.data
        } catch (error) {
            
        }
    }
    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubcribe}
        >
            Subscribe now
        </button>
    )
}