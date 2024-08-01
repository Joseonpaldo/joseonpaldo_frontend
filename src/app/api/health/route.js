export async function GET(request) {
  return new Response(JSON.stringify({status: 'OK'}),{
    status: 200,
    headers: {
      'Content-Type': 'application/json'}
  });
}
