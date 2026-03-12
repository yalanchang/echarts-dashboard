
export const formatWeekday = (date: Date | string) =>
    new Intl.DateTimeFormat('zh-TW', { weekday: 'short' }).format(new Date(date))
  
  export const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(new Date(date))
  
  export const formatTime = (date: Date | string) =>
    new Intl.DateTimeFormat('zh-TW', {
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(date))
  
  export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('zh-TW', {
      style: 'currency', currency: 'TWD', minimumFractionDigits: 0
    }).format(amount)
  
  export const formatRelative = (date: Date | string) => {
    const diff = Math.round((new Date(date).getTime() - Date.now()) / 60000)
    return new Intl.RelativeTimeFormat('zh-TW', { numeric: 'auto' })
      .format(diff < -60 ? Math.round(diff / 60) : diff, diff < -60 ? 'hour' : 'minute')
  }