import React from 'react'
import { avatarTone, initials } from '../utils/tone'

// One avatar everywhere: the real picture when there is one, otherwise the
// person's initials on a tint derived from their id, so a list of them still
// reads as distinct people instead of a row of identical placeholders.
function Avatar({ user, size = "size-10", text = "text-[11px]", ring = "", className = "", onClick }) {
  const name = user?.name || user?.userName
  const shell = `${size} ${ring} ${className} shrink-0 overflow-hidden rounded-full ${onClick ? "cursor-pointer" : ""}`

  if (user?.profileImage) {
    return (
      <div className={shell} onClick={onClick}>
        <img src={user.profileImage} alt={name || ""} className='size-full object-cover' />
      </div>
    )
  }

  return (
    <div
      className={`avatar ${avatarTone(user?._id)} ${size} ${ring} ${className} grid shrink-0 place-items-center rounded-full ${text} font-bold text-foreground ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {initials(name)}
    </div>
  )
}

export default Avatar
