function MyButton({ label }: { label: string }) {
  return (
    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
         {label}
    </button>
  )
}

export default MyButton
