import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
 
public class DanceMoovesSilver {
 
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(tokenizer.nextToken());
        int k = Integer.parseInt(tokenizer.nextToken());
        int[] cows = new int[n + 1];
        List<Integer>[] viewed = new List[n + 1];
        for (int j = 1; j <= n; j++) {
            cows[j] = j;
            viewed[j] = new ArrayList<>();
            viewed[j].add(j);
        }
        for (long t = 1; t <= k; t++) {
            tokenizer = new StringTokenizer(in.readLine());
            int a = Integer.parseInt(tokenizer.nextToken());
            int b = Integer.parseInt(tokenizer.nextToken());
            int c = cows[a];
            int d = cows[b];
            cows[a] = d;
            cows[b] = c;
            viewed[cows[a]].add(a);
            viewed[cows[b]].add(b);
        }
        int[] answer = new int[n + 1];
        for (int r = 1; r <= n; r++) {
            if (cows[r] != 0) {
                List<Integer> cycle = new ArrayList<>();
                int j = r;
                while (cows[j] != 0) {
                    cycle.add(j);
                    j = cows[j];
                    cows[cycle.get(cycle.size() - 1)] = 0;
                }
                Set<Integer> viewedHere = new HashSet<>();
                for (int cow : cycle) {
                    viewedHere.addAll(viewed[cow]);
                }
                for (int cow : cycle) {
                    answer[cow] = viewedHere.size();
                }
            }
        }
        StringBuilder out = new StringBuilder();
        for (int j = 1; j <= n; j++) {
            out.append(answer[j]).append('\n');
        }
        System.out.print(out);
    }
}
