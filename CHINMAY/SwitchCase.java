import java.util.*;

public class SwitchCase {
    public static void main(String[] args) {
      Scanner sc = new Scanner(System.in);
      
      System.out.print("enter first");
      int first = sc.nextInt();
      System.out.print("enter second");
      int second = sc.nextInt();
      
      System.out.print("enter operator");
      int op = sc.next().charAt(0);
      
      switch(op){
        case '+':
          System.out.print("additon is "+ (first + second));
          break;
        case '-':
          System.out.print("subtraction is "+ (first - second));
          break;
        default:
          System.out.println("no op performed");
          break;
      }
    }
  }