import Image from 'next/image'
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        To see Product List...
      <Link className={"text-blue-500"} href="/products"> Go to Products Page</Link>

      </div>
    </main>
  )
}
