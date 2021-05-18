#include <iostream>
 
int main() {
  std::string alphabet, s;
  std::cin >> alphabet >> s;
  std::string hummed = "";
  for(int numHums = 1; true; numHums++) {
    hummed += alphabet;
    int idx = 0;
    for(int i = 0; i < hummed.size() && idx < s.size(); i++) {
      if(hummed[i] == s[idx]) {
        idx++;
      }
    }
    if(idx == s.size()) {
      std::cout << numHums << "\n";
      return 0;
    }
  }
}
