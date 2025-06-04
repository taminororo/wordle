function AlphabetButton({ label }: { label:string}) {
  return (
    <div className="p-2.5 bg-stone-300 rounded-sm inline-flex flex-col justify-center items-center">
        <button className="text-black text-base font-normal font-sans">
            {label}
        </button>
    </div>
  )
}

export default AlphabetButton