import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;
 
public class NoTimeToPaint {
 
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer = new StringTokenizer(in.readLine());
        int n = Integer.parseInt(tokenizer.nextToken());
        int m = Integer.parseInt(tokenizer.nextToken());
        String colors = " " + in.readLine();
        int[] last = new int[26];
        int[] prefixes = new int[n + 1];
        for (int j = 1; j <= n; j++) {
            prefixes[j] = prefixes[j - 1];
            int letter = colors.charAt(j) - 'A';
            boolean isLeft = last[letter] == 0;
            for (int lighter = 0; lighter < letter; lighter++) {
                if (last[lighter] > last[letter]) {
                    isLeft = true;
                }
            }
            if (isLeft) {
                prefixes[j]++;
            }
            last[letter] = j;
        }
        Arrays.fill(last, n + 1);
        int[] suffixes = new int[n + 2];
        for (int j = n; j >= 1; j--) {
            suffixes[j] = suffixes[j + 1];
            int letter = colors.charAt(j) - 'A';
            boolean isRight = last[letter] == n + 1;
            for (int lighter = 0; lighter < letter; lighter++) {
                if (last[lighter] < last[letter]) {
                    isRight = true;
                }
            }
            if (isRight) {
                suffixes[j]++;
            }
            last[letter] = j;
        }
        StringBuilder out = new StringBuilder();
        for (int j = 1; j <= m; j++) {
            tokenizer = new StringTokenizer(in.readLine());
            int a = Integer.parseInt(tokenizer.nextToken());
            int b = Integer.parseInt(tokenizer.nextToken());
            out.append(prefixes[a - 1] + suffixes[b + 1]).append('\n');
        }
        System.out.print(out);
    }
}
