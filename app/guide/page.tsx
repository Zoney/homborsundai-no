'use client'
import { useEffect, useState } from 'react'
import MiniSearch from 'minisearch'

interface TocItem {
  id: string
  title: string
  children?: TocItem[]
}

interface Section {
  id: string
  title: string
  html: string
}

export default function GuidePage() {
  const [toc, setToc] = useState<TocItem[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [currentId, setCurrentId] = useState<string>('1.1')
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      const tocRes = await fetch('/data/toc.json')
      const tocData = await tocRes.json()
      setToc(tocData)
      const secRes = await fetch('/data/sections.json')
      const secData = await secRes.json()
      setSections(secData)
      const stored = localStorage.getItem('bookmarks')
      if (stored) setBookmarks(JSON.parse(stored))
    }
    load()
  }, [])

  useEffect(() => {
    const mini = new MiniSearch({ fields: ['title', 'html'], storeFields: ['id', 'title'] })
    mini.addAll(sections)
    if (search) {
      setSearchResults(mini.search(search))
    } else {
      setSearchResults([])
    }
  }, [search, sections])

  function renderToc(items: TocItem[]) {
    return (
      <ul className="ml-4 list-disc">
        {items.map(it => (
          <li key={it.id} className="cursor-pointer" onClick={() => setCurrentId(it.id)}>
            {it.title}
            {it.children && renderToc(it.children)}
          </li>
        ))}
      </ul>
    )
  }

  const current = sections.find(s => s.id === currentId)

  function toggleBookmark(id: string) {
    const next = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id]
    setBookmarks(next)
    localStorage.setItem('bookmarks', JSON.stringify(next))
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">KI-Assistant Guide</h1>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 w-full mb-4 text-black"
      />
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Search results</h2>
          <ul>
            {searchResults.map(r => (
              <li key={r.id} onClick={() => setCurrentId(r.id)} className="underline cursor-pointer">
                {r.title}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-6">
        <nav className="w-1/3 overflow-y-auto max-h-[60vh]">
          {renderToc(toc)}
        </nav>
        <article className="w-2/3 prose prose-invert">
          {current && (
            <div>
              <h2>{current.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: current.html }} />
              <button onClick={() => toggleBookmark(current.id)} className="mt-4 px-2 py-1 bg-blue-600 text-white rounded">
                {bookmarks.includes(current.id) ? 'Remove bookmark' : 'Bookmark'}
              </button>
            </div>
          )}
        </article>
      </div>
      {bookmarks.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold">My Briefcase</h2>
          <ul>
            {bookmarks.map(id => {
              const sec = sections.find(s => s.id === id)
              return sec ? (
                <li key={id} className="underline cursor-pointer" onClick={() => setCurrentId(id)}>
                  {sec.title}
                </li>
              ) : null
            })}
          </ul>
        </section>
      )}
    </main>
  )
}
