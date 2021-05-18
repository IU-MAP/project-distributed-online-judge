#include <iostream>
using namespace std;
 
int main(void)
{
  int O=0, E=0, N, x;
  cin >> N;
  for (int i=0; i<N; i++) {
    cin >> x;
    if (x % 2 == 0) E++; else O++;
  }
  while (O > E) { O=O-2; E++; }
  if (E > O+1) E = O+1;
  cout << E + O << "\n";
}
