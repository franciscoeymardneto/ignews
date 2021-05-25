import { signIn, useSession } from "next-auth/client"
import styles from "./styles.module.scss"
interface SubscribeButtonProps {
    productId: string
}

// getServerSideProps (SSR)
// getStaticProps (SSG)
// API routes
export function SubscribeButton({ productId } : SubscribeButtonProps) {
    const [ session ] = useSession()

    function handleSubcribe(){
        if (!session) {
            signIn('github')
            return            
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