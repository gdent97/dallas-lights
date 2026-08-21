'use client'

import { useState } from 'react'

const CHECKLIST_GROUPS = [
  {
    title: 'August–September: plan and book',
    items: [
      'Choose temporary seasonal lights or a permanent lighting system.',
      'Decide which rooflines, trees, walkways, and entry areas you want lit.',
      'Check any HOA or property rules that apply to your home.',
      'Request and compare written quotes from local installers.',
    ],
  },
  {
    title: 'October–November: prepare and install',
    items: [
      'Confirm the installation date, design, colors, timer, and total price.',
      'Confirm who handles maintenance, takedown, and storage.',
      'Test outdoor outlets and make sure the planned setup uses outdoor-rated equipment.',
      'Move vehicles, decorations, and fragile items away from work areas before installation.',
    ],
  },
  {
    title: 'December–January: maintain and wrap up',
    items: [
      'Save the installer’s service contact in case part of the display goes out.',
      'Keep cords, plugs, and decorations clear of walkways and standing water.',
      'Confirm the takedown window and what must remain accessible to the crew.',
      'Save a photo and notes about what you want to repeat or change next season.',
    ],
  },
] as const

const TOTAL_ITEMS = CHECKLIST_GROUPS.reduce((total, group) => total + group.items.length, 0)

export default function HolidayPlannerChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set())

  function toggleItem(item: string) {
    setCompleted((current) => {
      const next = new Set(current)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })
  }

  const percent = Math.round((completed.size / TOTAL_ITEMS) * 100)

  return (
    <section aria-labelledby="planner-checklist-heading" className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mb-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <p className="text-sm font-semibold text-brand-700 mb-1">Free interactive planner</p>
          <h2 id="planner-checklist-heading" className="text-2xl font-bold text-gray-900">Your holiday lighting checklist</h2>
        </div>
        <p className="text-sm font-medium text-gray-600" aria-live="polite">
          {completed.size} of {TOTAL_ITEMS} complete
        </p>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-7" aria-hidden="true">
        <div
          className="h-full bg-brand-500 rounded-full transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="space-y-7">
        {CHECKLIST_GROUPS.map((group) => (
          <fieldset key={group.title}>
            <legend className="font-bold text-gray-900 mb-3">{group.title}</legend>
            <div className="space-y-3">
              {group.items.map((item) => {
                const checked = completed.has(item)
                return (
                  <label key={item} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(item)}
                      className="mt-0.5 h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className={`text-sm leading-relaxed ${checked ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      {item}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {completed.size > 0 && (
        <button
          type="button"
          onClick={() => setCompleted(new Set())}
          className="mt-7 text-sm font-medium text-gray-500 hover:text-gray-800 underline underline-offset-4"
        >
          Reset checklist
        </button>
      )}
    </section>
  )
}
