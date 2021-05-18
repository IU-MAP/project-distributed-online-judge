#include "bits/stdc++.h"
using namespace std;

int N, A[20], B[20];
long answer = 1;

int count_bigger(int x) {
  // Count the number of values of B_i which are greater than or equal to x
  int cnt = 0;
  for (int i=0; i<N; i++) {
    if (B[i] >= x) {
      cnt ++;
    }
  }
  return cnt;
}

int main() {
    cin >> N;
    for (int i=0; i<N; i++) {
      cin >> A[i];
    }
    for (int i=0; i<N; i++) {
      cin >> B[i];
    }
    sort(A, A+N);

    for (int i=N-1; i>=0; i--) {
      answer *= count_bigger(A[i]) - (N-1 - i);
    }

    cout << answer << endl;
}
