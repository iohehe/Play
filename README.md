
# Play
__But it doesn't work now__ QAQ
---
Play is a tiny language for me to learn PL. It is just a private pratice language and I will complete it by many steps:
### Level0-1: Basic
	0: Write a basic lexcial scanner and a sytax parse
    1: Do easy semantic analysis to dereference the function call by visit the AST tree.
    [TEST CASE]
	```
	    function echo() {
			println("hello");
        }
        echo();
    ``` 

### Level 2: Expression Statement
    Let your language support expression, there would be use operator-precedence parser to reslove this problem(https://en.wikipedia.org/wiki/Operator-precedence_parser).
    [TEST CAST]
    ```
	1+2+3;    // (+ (+ 1 2) 3)
        2+3*5;    // (+ 2 (* 3 5))
    ```

### Level 3: Variable Declare and Assignment Statement
	Lead into variable and type.
    [TEST CASE]
	```
		myAge = 1+2;
	```


### Level 4: Symbol Table
	Lead into sysmbol table
	[TEST CASE]    
	```
		let myAge:int;
		myAge+1;

		function echo666() {
		}

		echo666();
	```
