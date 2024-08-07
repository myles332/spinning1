import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = createClient()
  const { data } = await supabase.from('test').select()

  console.log(data);
  return <pre>{JSON.stringify(data)}</pre>
}