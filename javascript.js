// Always scope your code.
// This IIFE simulates JS files that our module is dependent on.
(function (global, $, undefined) {

	//just a comment
	/**
	 * Printer "class".
	 * Instances of Printer can output to the screen,
	 * with each instance initialized with a different container
	 * and a default class name for every printed line.
   * TODO Define JSDoc for IIFEs
	 */
	var Printer = (function (Printer) {

		// Default settings for our object
		var printerSettings = {
			container: "",
			className: "",
			tagName: "div"
		};

		/**
		 * Printer constructor.
		 * @param {Object} [settings] - Printer settings
		 */
		Printer = function (settings) {

			// Allow for empty construction
			this.init(settings || printerSettings);
		};

		/**
		 * Initialize the instance with a couple of settings.
		 * @param {Object} settings - Printer settings
		 */
		Printer.prototype.init = function (settings) {
			// Use this pattern to extend default settings
			$.extend(true, printerSettings, settings);

			// Cache DOM references,
			// because we don't have extra "$"s to spend (performance)
			this.container = $(printerSettings.container);
			this.className = printerSettings.className;
		};

		/**
		 * Wraps a message to print with HTML.
		 * @param {string} message - A message to print.
		 * @param {string} [className] - Class name for the printed line.
		 */
		Printer.prototype.htmlify = function (message, className) {

			// Only exception to double-quotes are HTML strings
			return $('<' + printerSettings.tagName + ' />', {

				// Use the OR operator for conditional assignment expressions
				class: className || this.className || "",
				text: message
			});
		};

		/**
		 * Prints a message to the container.
		 * @param {string} message - A message to print.
		 * @param {string} [className] - Class name for the printed line.
		 */
		Printer.prototype.print = function (message, className) {

			message = this.htmlify(message, className);
			this.container.append(message);
		};

		/**
		 * Cleans the container of printed tags.
		 */
		Printer.prototype.clean = function () {

			this.container.find(printerSettings.tagName).remove();
		};

		return Printer;

	}(Printer));

	// Expose our functionality to the global scope
	global.Printer = Printer;

}(window, jQuery));



// Always scope your code
(function (global, $, undefined) {

	// Put one space before function brackets
	// Put one line break after function definition
	// Cache the window global, and encapsulate in this scope

	/**
	 * This is an example module that contains some coding style
	 * wisdom, to use it please follow this initialization pattern:
	 *	game.init({
	 * 		game: 42,
	 * 		containers: {
	 * 			log: "output",
	 * 			foos: ".foos"
	 * 		},
	 * 		classNames: {
	 * 			foo: "foo",
	 * 			selected: "selected"
	 * 		}
	 * 	});
	 *
	 * We use JSDoc comments for objects, modules and functions
	 */
	var game = (function (Printer) {

		// Declare module dependencies as IIFE parameters.

		/*--------------------------------------------------------------------------
		 * PRIVATE MEMBERS
		 * All private variables and functions go here
		 *--------------------------------------------------------------------------*/

		// Use the var keyword next to every variable.
		// It's easier to add/remove variables later and less error-prone
		// to "," omitting + easier to diff in source control

		/**
		 * Default settings for our module
		 */
		var gameSettings = {
			game: 42,
			containers: {
				log: "output",
				foos: ".foos"
			},
			classNames: {
				foo: ""
			}
		};

		/**
		 * Printer instances to output different stuff to the log
		 */
		var logger = new Printer();
		var fooPrinter = new Printer();


		/**
		 * A classic class.
		 * We make instances of it.
		 * Look how CapitalCase it is - a beauty.
		 */
		var Foo = (function (Foo, logger, fooPrinter) {

			// Explicitly pass globals as arguments

			// A nice pattern for instance-based Classes that gives us
			// static private methods - a Javascript rarity.
			function calcUniverse (value) {

				return value * 42;
			}

			/**
			 * Constructor
			 */
			Foo = function (foo) {

				// Private instance variable
				var instanceId = "_foo_" + parseInt(Math.random() * 1000000);

				// Public instance variable
				this.foo = foo;

				// Public instance-scope method
				this.baz = function () {

					// I'm a memory-hog in many-instances scenarios
				};

				logger.print("new instance of Foo=" + instanceId);
			}

			// Public prototype-scope method
			// Shared definition
			Foo.prototype.getFoo = function () {

				this.answer = calcUniverse(this.foo + 1);
				return "my answer to the universe=" + this.answer;
			};

			Foo.prototype.print = function () {

				fooPrinter.print(this.getFoo());
			}

			return Foo;

		}(Foo, logger, fooPrinter));

		/**
		 * A nice and simple helper object.
		 * Use as many of these as you can, they're handy and cheap.
		 *
		 * Rule of thumb: 2 functions and 1 variable relating to the same
		 * task justifies a helper object.
		 *
		 * Use a literal when you don't need encapsulation or multiple instances.
		 * Otherwise your helper should be a constructor function or a module.
		 */
		var Gamer = {

			// Use line-breaks between properties if the object
			// is longer than one screen
			foos: [],

			foosShuffle: [],

			isDirty: false,

			fillFoos: function (length) {

				for (var i = 0; i < length; i++) {
					this.foos[i] = new Foo(i);
				}
			},

			clean: function () {

				this.foos.length = 0;
				this.foosShuffle.length = 0;
			},

			play: function () {

				// Save "this" reference for use when changing execution context.
				// Use explicit naming, but don't use the objects' name:
				// var this{ObjectName} = this;
				// Don't mix it with "this" - be consistent.
				var thisGamer = this;

				// Always use Promises in async functions
				var deferred = $.Deferred();

				var countdown = thisGamer.foos.length;

				// Declare helper functions, can use closure variables
				function makeMove (index) {

					var foo = thisGamer.foos[index];
					foo.print();
					thisGamer.foosShuffle.push(foo);
					countdown--;

					// We're done on the last index
					if (countdown === 0) {
						thisGamer.isDirty = true;
						deferred.resolve();
					}
				}

				// Cache vars before loops for performance
				for (var i = 0, l = thisGamer.foos.length; i < l; i++) {

					// Save calculations in local variables
					var delay = parseInt(Math.random() * 3000);

					// Use globals explicitly
					global.setTimeout((function (index) {

						// Create wrapper function when using closure in a loop
						return function () {
							makeMove(index);
						};

					}(i)), delay);
				}

				return deferred;
			},

			selectWinners: function () {

				// List of vars on separate lines,
				// makes maintenance and version control easier
				var args = Array.prototype.slice.call(arguments);

				// One-liner precondition
				// a.k.a if (!foo) return;
				// (not possible with JSHint)
				if (args.length === 0) {
					return;
				};

				// Use Array.map to quickly iterate arrays
				// (see also Array.forEach)
				var fooAnswers = this.foosShuffle.map(function (foo) {

					return foo.answer;
				});

				function selectWinner (index) {

					var answer = args[i];
					var winnerIndex = fooAnswers.indexOf(answer);
					logger.print("Answer " + (answer/42) + " is at position " + (winnerIndex+1));
					$(".foo:eq(" + winnerIndex + ")").addClass(gameSettings.classNames.selected);

				}

				for (var i = 0, l = args.length; i < l; i++) {
					selectWinner(i);
				}
			},

			init: function (game) {

				this.fillFoos(game);
			}

		};


		/*---------------------------------------------------------------------------
		 * PUBLIC METHODS
		 * Stuff we return and can be used by module.stuff goes here
		 *--------------------------------------------------------------------------*/

		/**
		 * Does all things needed to start the game every time.
		 * @triggers {finished}
		 */
		function play () {

			// Wrap module context with jQuery
			var $game = $(this);

			// Clean-up the game after each play
			if (Gamer.isDirty) {

				// Line-break after if statements when you have comments
				Gamer.clean();
				logger.clean();
				fooPrinter.clean();

				// Line-break to visually separate code blocks
				Gamer.init(gameSettings.game);
			}

			Gamer.play().done(function () {

				// Utilize jQuery custom events for simple and effective code-decoupling
				$game.trigger("finished");
			});
		}

		/**
		 * Provide game logging functionality to the users of our module.
		 */
		function log () {

			// Use Function.apply to pass responsibility of handling
			// the arguments to the context object
			return logger.print.apply(logger, arguments);
		}

		/**
		 * A completely useless function with the sole purpose
		 * of showcasing different coding style aspects which
		 * weren't covered throughout our code yet.
		 *
		 * @param {string} a - Three digit number.
		 * @param {string} b - Three digit number.
		 * @returns {string} - Completely useless string.
		 */
		function completelyUseless (a, b) {

			var ret = "nope...";
			var baz = "";
			var bar = {
				x: 0,
				y: 0,
				z: 7
			};

			// We use one line-break to divide the code into logical blocks
			for (var poo in bar) {
				if (bar.hasOwnProperty(poo)) {
					baz += bar[poo];
				}
			}

			// Use the "===" operator unless you explicitly want type coercion
			// (which is like, never?)
			if (baz === a) {
				// A comment inside an "if" statement
				ret = "Cool!";

			} else if (baz === b) {
				// Use one line-break between crowded "if-else" statements
				ret = "Awesome!";
			}

			// One return point
			return ret;
		}

		/**
		 * @param {Object} settings - Settings for our module.
		 * @triggers {initialized}
		 */
		function init (settings) {

			// Wrap module context with jQuery
			$game = $(this);

			$.extend(true, gameSettings, settings);

			// The main code section
			// Initialize all our private helpers
			logger.init({
				container: gameSettings.containers.log
			});

			fooPrinter.init({
				container: gameSettings.containers.foos,
				className: gameSettings.classNames.foo
			});

			Gamer.init(gameSettings.game);

			// Utilize jQuery custom events for simple and effective code-decoupling
			$game.trigger("initialized");
		}

		// This is our public API
		return {
			// Alias function names, don't define them here
			init: init,
			play: play,
			log: log,

			// Bind is OK here to retain context when referencing functions
			selectWinners: Gamer.selectWinners.bind(Gamer),
		}

	}(global.Printer)); // game


	// Expose module to global scope
	global.game = game;

}(window, jQuery)); // IIFE1 Scope



// Module usage, in other file...
(function (global, $, undefined) {

	// Use exposed globals
	var game = global.game;
	var $game = $(game);

	// Bind listeners to module events
	$game.on("initialized", function () {

		game.log("initialized!", "event");
	});

	$game.on("finished", function () {

		game.log("finished!", "event");
		game.selectWinners(42, 42*42);
	});

	// Initialize the module
	game.init({
		game: 42,
		containers: {
			log: "output",
			foos: ".foos"
		},
		classNames: {
			foo: "foo",
			selected: "selected"
		}
	});

	// UI Logic
	var $button = $("button");
	var $logTitle = $(".log h2");
	var $output = $("output");

	// Activate module based on business logic
	$button.on("click", game.play.bind(game));

	$logTitle.on("click", function () {
		$output.toggle();
	});


}(window, jQuery)); // IIFE2 Scope
